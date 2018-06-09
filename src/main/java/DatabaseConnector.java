import java.io.File;
import java.sql.*;

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
            ResultSet rs = pstmt.executeQuery();
            return !rs.next();
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean createNewUser(String email, String hashedPassword, String salt, boolean isAdmin) {
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

    public static boolean createNewRequest(String name, int idUser) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("INSERT INTO request VALUES (NULL, ?, ?);");
            pstmt.setString(1, name);
            pstmt.setInt(2, idUser);
            pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean isFirstUser() {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT idUser FROM user;");
            return !rs.next();
        } catch (SQLException e) {
            return false;
        }
    }

    public static User getUserByEmail(String email) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM user WHERE email = ?;");
            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new User(rs);
            } else {
                return null;
            }
        } catch (SQLException e) {
            return null;
        }
    }

    public static User getUserById(int idUser) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {
            PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM user WHERE idUser = ?;");
            pstmt.setInt(1, idUser);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new User(rs);
            } else {
                return null;
            }
        } catch (SQLException e) {
            return null;
        }
    }

}
