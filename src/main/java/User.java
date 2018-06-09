import javax.json.Json;
import javax.json.JsonObject;
import java.sql.ResultSet;
import java.sql.SQLException;

public class User implements DatabaseObject {
    public int idUser;
    public String email;
    public String password;
    public String salt;
    public boolean isAdmin;
    public String currentXSRFToken;

    public User(ResultSet rs) throws SQLException {
        this.setValues(rs);
    }

    @Override
    public void setValues(ResultSet rs) throws SQLException {
        this.idUser = rs.getInt("idUser");
        this.email = rs.getString("email");
        this.password = rs.getString("password");
        this.salt = rs.getString("salt");
        this.isAdmin = rs.getString("isAdmin").equals("Y");
        this.currentXSRFToken = "";
    }

    @Override
    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add("idUser", "" + this.idUser)
            .add("email", this.email)
            .add("isAdmin", this.isAdmin)
            .add("xsrfToken", this.currentXSRFToken)
            .build();
    }
}
