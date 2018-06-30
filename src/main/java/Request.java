import javax.json.Json;
import javax.json.JsonObject;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Request implements DatabaseObject {
    public int idRequest;
    public String name;
    public int idUser;

    public Request(ResultSet rs) throws SQLException {
        this.setValues(rs);
    }

    @Override
    public void setValues(ResultSet rs) throws SQLException {
        this.idRequest = rs.getInt("idRequest");
        this.name = rs.getString("name");
        this.idUser = rs.getInt("idUser");
    }

    @Override
    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add("idRequest", "" + this.idRequest)
            .add("name", this.name)
            .add("idUser", "" + this.idUser)
            .build();
    }
}
