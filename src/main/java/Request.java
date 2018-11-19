import javax.json.Json;
import javax.json.JsonObject;
import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;

public class Request implements DatabaseObject {
    private int idRequest;
    public String name;
    private int idUser;
    private long idGuest;
    private String userEmail;
    private long date;
    private String dateDisplay;
    private long expiration;
    private String expirationDisplay;

    Request(ResultSet rs) throws SQLException {
        this.setValues(rs);
    }

    @Override
    public void setValues(ResultSet rs) throws SQLException {
        this.idRequest = rs.getInt("idRequest");
        this.name = rs.getString("name");
        try {
            this.idUser = rs.getInt("idUser");
            this.idGuest = 0;
            this.userEmail = rs.getString("email");
        } catch (SQLException e) {
            this.idGuest = rs.getLong("idGuest");
            this.idUser = 0;
            this.userEmail = "Guest User";
        }
        this.date = rs.getLong("date");
        this.dateDisplay = Date.from(Instant.ofEpochSecond(this.date)).toString();
        this.expiration = rs.getLong("expiration");
        if (this.expiration > 0) {
            this.expirationDisplay = Date.from(Instant.ofEpochSecond(this.expiration)).toString();
        } else {
            this.expirationDisplay = "No Expiration";
        }
    }

    @Override
    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add("idRequest", "" + this.idRequest)
            .add("name", this.name)
            .add("idUser", "" + this.idUser)
            .add("idGuest", "" + this.idGuest)
            .add("userEmail", this.userEmail)
            .add("date", this.date)
            .add("dateDisplay", this.dateDisplay)
            .add("expiration", this.expiration)
            .add("expirationDisplay", this.expirationDisplay)
            .add("size", this.getSize())
            .add("applicationName", this.getApplicationName())
            .build();
    }

    public long getSize() {
        long size = 0;
        try {
            size = Util.fileSize(ConfiguratorServlet.ROOT_PATH + File.separator + this.name);
        } catch (Exception e) {
        }
        return size;
    }

    private String getApplicationName() {
        Application application = GetRequestServlet.getApplicationForRequest(this.name);
        return application != null ? application.name : "";
    }
}
