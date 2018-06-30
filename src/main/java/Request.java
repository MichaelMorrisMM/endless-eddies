import javax.json.Json;
import javax.json.JsonObject;
import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Request implements DatabaseObject {
    public int idRequest;
    public String name;
    public int idUser;
    public String userEmail;

    public Request(ResultSet rs) throws SQLException {
        this.setValues(rs);
    }

    @Override
    public void setValues(ResultSet rs) throws SQLException {
        this.idRequest = rs.getInt("idRequest");
        this.name = rs.getString("name");
        this.idUser = rs.getInt("idUser");
        this.userEmail = rs.getString("email");
    }

    @Override
    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add("idRequest", "" + this.idRequest)
            .add("name", this.name)
            .add("idUser", "" + this.idUser)
            .add("userEmail", this.userEmail)
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
