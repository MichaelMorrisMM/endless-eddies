import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import java.sql.ResultSet;
import java.sql.SQLException;

public class User implements DatabaseObject {
    public int idUser;
    public String email;
    public String password;
    public String salt;
    public boolean isAdmin;
    public String currentXSRFToken;

    private final boolean liteMode;

    public User(ResultSet rs) throws SQLException {
        this.liteMode = false;
        this.setValues(rs);
    }

    public User(ResultSet rs, boolean liteMode) throws SQLException {
        this.liteMode = liteMode;
        this.setValues(rs);
    }

    @Override
    public void setValues(ResultSet rs) throws SQLException {
        this.idUser = rs.getInt("idUser");
        this.email = rs.getString("email");
        this.isAdmin = rs.getString("isAdmin").equals("Y");
        this.currentXSRFToken = "";
        if (!this.liteMode) {
            this.password = rs.getString("password");
            this.salt = rs.getString("salt");
        }
    }

    @Override
    public JsonObject toJsonObject() {
        JsonObjectBuilder builder = Json.createObjectBuilder()
            .add("idUser", "" + this.idUser)
            .add("email", this.email)
            .add("isAdmin", this.isAdmin);
        if (!this.liteMode) {
            builder = builder.add("xsrfToken", this.currentXSRFToken);
        }
        return builder.build();
    }
}
