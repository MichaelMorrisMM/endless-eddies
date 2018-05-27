import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnector {
    public static final String connectionUrl = "jdbc:sqlite:" + ConfiguratorServlet.ROOT_PATH + File.separator + "endless_eddies.db";

    public static boolean verifyEmailUnique(String email) {
        try (Connection conn = DriverManager.getConnection(connectionUrl)) {

        } catch (SQLException e) {

        }
        return false;
    }

}
