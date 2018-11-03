import java.io.File;
import java.io.IOException;
import java.sql.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

public class DatabaseConnector {
    private static final String connectionUrl = "jdbc:sqlite:" + ConfiguratorServlet.ROOT_PATH + File.separator + "endless_eddies.db";

    static {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            System.out.println("An error occurred connecting to database");
        }
    }

    public static boolean verifyEmailUnique(String email) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT idUser FROM user WHERE email = ?;");
            pstmt.setString(1, email);
            try (ResultSet rs = pstmt.executeQuery()) {
                return !rs.next();
            }
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean createNewUser(String email, String hashedPassword, String salt) {
        // If this is the very first user created, set as admin
        // Otherwise, set as non-admin
        boolean isAdmin = isFirstUser();

        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("INSERT INTO user VALUES (NULL, ?, ?, ?, ?);");
            pstmt.setString(1, email);
            pstmt.setString(2, hashedPassword);
            pstmt.setString(3, salt);
            pstmt.setString(4, isAdmin ? "Y" : "N");
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean updateUser(User user) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("UPDATE user SET email = ?, password = ?, salt = ? WHERE idUser = ?;");
            pstmt.setString(1, user.email);
            pstmt.setString(2, user.password);
            pstmt.setString(3, user.salt);
            pstmt.setInt(4, user.idUser);
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean deleteUser(int idUser) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT name FROM request WHERE idUser = ? AND idGuest IS NULL;");
            pstmt.setInt(1, idUser);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    try {
                        Util.deleteRequestFiles(rs.getString("name"));
                    } catch (IOException e) {
                        // Continue attempting to delete user
                    }
                }
            }

            pstmt = conn.prepareStatement("DELETE FROM request WHERE idUser = ? AND idGuest IS NULL;");
            pstmt.setInt(1, idUser);
            pstmt.executeUpdate();

            pstmt = conn.prepareStatement("DELETE FROM user WHERE idUser = ?;");
            pstmt.setInt(1, idUser);
            pstmt.executeUpdate();

            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean setUserPermissions(int idUser, boolean isAdmin) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("UPDATE user SET isAdmin = ? WHERE idUser = ?;");
            pstmt.setString(1, isAdmin ? "Y" : "N");
            pstmt.setInt(2, idUser);
            pstmt.executeUpdate();

            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean createNewRequest(String name, int idUser) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("INSERT INTO request VALUES (NULL, ?, ?, NULL, ?, ?);");
            pstmt.setString(1, name);
            pstmt.setInt(2, idUser);

            Instant now = Instant.now();
            Instant expiration = null;
            try {
                ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
                if (config.resultLifespan > 0) {
                    expiration = now.plus(config.resultLifespan, ChronoUnit.DAYS);
                }
            } catch (IOException e) {
            }
            pstmt.setLong(3, now.getEpochSecond());
            if (expiration != null) {
                pstmt.setLong(4, expiration.getEpochSecond());
            } else {
                pstmt.setNull(4, Types.INTEGER);
            }

            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean createNewGuestRequest(String name, long idGuest) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("INSERT INTO request VALUES (NULL, ?, NULL, ?, ?, ?);");
            pstmt.setString(1, name);
            pstmt.setLong(2, idGuest);

            Instant now = Instant.now();
            Instant expiration = now.plus(1, ChronoUnit.DAYS);
            pstmt.setLong(3, now.getEpochSecond());
            pstmt.setLong(4, expiration.getEpochSecond());

            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean isFirstUser() {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            Statement stmt = conn.createStatement();
            try (ResultSet rs = stmt.executeQuery("SELECT idUser FROM user;")) {
                return !rs.next();
            }
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean doesRequestExist(int idRequest) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT idRequest FROM request WHERE idRequest = ?;");
            pstmt.setInt(1, idRequest);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            return false;
        }
    }

    public static String checkRequestStatus(String requestName) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT idRequest FROM request WHERE name = ?;");
            pstmt.setString(1, requestName);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return "" + rs.getInt("idRequest");
                } else {
                    return "";
                }
            }
        } catch (SQLException e) {
            return "";
        }
    }

    public static boolean userCanManageRequest(User user, int idRequest) {
        if (user.isAdmin) {
            return true;
        }

        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt;
            if (!user.isGuest) {
                pstmt = conn.prepareStatement("SELECT idRequest FROM request WHERE idRequest = ? AND idUser = ? AND idGuest IS NULL;");
                pstmt.setInt(1, idRequest);
                pstmt.setInt(2, user.idUser);
            } else {
                pstmt = conn.prepareStatement("SELECT idRequest FROM request WHERE idRequest = ? AND idGuest = ? AND idUser IS NULL;");
                pstmt.setInt(1, idRequest);
                pstmt.setLong(2, user.idGuest);
            }
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean deleteRequest(int idRequest) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT name FROM request WHERE idRequest = ?;");
            pstmt.setInt(1, idRequest);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    try {
                        Util.deleteRequestFiles(rs.getString("name"));
                    } catch (IOException e) {
                        return false;
                    }
                }
            }

            pstmt = conn.prepareStatement("DELETE FROM request WHERE idRequest = ?;");
            pstmt.setInt(1, idRequest);
            pstmt.executeUpdate();

            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static User getUserByEmail(String email) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM user WHERE email = ?;");
            pstmt.setString(1, email);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new User(rs);
                } else {
                    return null;
                }
            }
        } catch (SQLException e) {
            return null;
        }
    }

    public static User getUserById(int idUser) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM user WHERE idUser = ?;");
            pstmt.setInt(1, idUser);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new User(rs);
                } else {
                    return null;
                }
            }
        } catch (SQLException e) {
            return null;
        }
    }

    public static List<User> getManageUsersList(int idUser) {
        List<User> users = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM user WHERE idUser != ?;");
            pstmt.setInt(1, idUser);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    users.add(new User(rs, true));
                }
            }
        } catch (SQLException e) {
            return null;
        }
        return users;
    }

    public static List<Request> getRequestsList(User user) {
        List<Request> requests = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt;
            if (user.isAdmin) {
                pstmt = conn.prepareStatement("SELECT idRequest, name, user.idUser, email, date, expiration FROM request JOIN user ON request.idUser = user.idUser WHERE request.idGuest IS NULL;");
            } else if (user.isGuest) {
                pstmt = conn.prepareStatement("SELECT idRequest, name, idGuest, date, expiration FROM request WHERE request.idGuest = ? AND request.idUser IS NULL;");
                pstmt.setLong(1, user.idGuest);
            } else {
                pstmt = conn.prepareStatement("SELECT idRequest, name, user.idUser, email, date, expiration FROM request JOIN user ON request.idUser = user.idUser WHERE request.idUser = ? AND request.idGuest IS NULL;");
                pstmt.setInt(1, user.idUser);
            }
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    try {
                        requests.add(new Request(rs));
                    } catch (Exception e) {
                    }
                }
            }
            if (user.isAdmin) {
                pstmt = conn.prepareStatement("SELECT idRequest, name, idGuest, date, expiration FROM request WHERE request.idUser IS NULL;");
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        try {
                            requests.add(new Request(rs));
                        } catch (Exception e) {
                        }
                    }
                }
            }
        } catch (SQLException e) {
            return null;
        }
        return requests;
    }

    public static List<Request> getUsersRequestsList(User user) {
        List<Request> requests = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt;
            if (user.isGuest) {
                pstmt = conn.prepareStatement("SELECT idRequest, name, idGuest, date, expiration FROM request WHERE request.idGuest = ? AND request.idUser IS NULL;");
                pstmt.setLong(1, user.idGuest);
            } else {
                pstmt = conn.prepareStatement("SELECT idRequest, name, user.idUser, email, date, expiration FROM request JOIN user ON request.idUser = user.idUser WHERE request.idUser = ? AND request.idGuest IS NULL;");
                pstmt.setInt(1, user.idUser);
            }
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    try {
                        requests.add(new Request(rs));
                    } catch (Exception e) {
                    }
                }
            }
        } catch (SQLException e) {
            return null;
        }
        return requests;
    }

    public static Request getRequest(int idRequest) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT idRequest, name, user.idUser, email, date, expiration FROM request JOIN user ON request.idUser = user.idUser WHERE idRequest = ? AND request.idGuest IS NULL;");
            pstmt.setInt(1, idRequest);
            try (ResultSet rsFirst = pstmt.executeQuery()) {
                if (rsFirst.next()) {
                    return new Request(rsFirst);
                } else {
                    pstmt = conn.prepareStatement("SELECT idRequest, name, idGuest, date, expiration FROM request WHERE idRequest = ? AND request.idUser IS NULL;");
                    pstmt.setInt(1, idRequest);
                    try (ResultSet rsSecond = pstmt.executeQuery()) {
                        if (rsSecond.next()) {
                            return new Request(rsSecond);
                        } else {
                            return null;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            return null;
        }
    }

    public static int deleteExpiredResults() {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            long expirationThreshold = Instant.now().getEpochSecond();
            PreparedStatement pstmt = conn.prepareStatement("SELECT name FROM request WHERE expiration IS NOT NULL AND expiration < ?;");
            pstmt.setLong(1, expirationThreshold);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    try {
                        Util.deleteRequestFiles(rs.getString("name"));
                    } catch (IOException e) {
                        return -1;
                    }
                }
            }

            pstmt = conn.prepareStatement("DELETE FROM request WHERE expiration IS NOT NULL AND expiration < ?;");
            pstmt.setLong(1, expirationThreshold);
            return pstmt.executeUpdate();
        } catch (SQLException e) {
            return -1;
        }
    }

}
