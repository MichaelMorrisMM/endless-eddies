import javax.json.Json;
import javax.json.JsonObject;
import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;

public class Request implements DatabaseObject {
    public int idRequest;
    public String name;
    public int idUser;
    public long idGuest;
    public String userEmail;
    public String date;
    public String expiration;

    public Request(ResultSet rs) throws SQLException {
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
        this.date = rs.getString("date");
        long exp = rs.getLong("expiration");
        if (exp > 0) {
            this.expiration = Date.from(Instant.ofEpochSecond(exp)).toString();
        } else {
            this.expiration = "No Expiration";
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
            .add("expiration", this.expiration)
            .add("size", this.getSize())
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
}
