import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;

public class User implements DatabaseObject {
    public int idUser;
    public long idGuest;
    public String email;
    public String password;
    public String salt;
    public boolean isAdmin;
    public boolean isGuest;
    public boolean isExternal;
    public String currentXSRFToken;
    private long storageUsed;

    private boolean liteMode;

    private User() {
        this.idUser = 0;
        this.idGuest = 0;
        this.email = "";
        this.password = "";
        this.salt = "";
        this.isAdmin = false;
        this.isGuest = false;
        this.isExternal = false;
        this.currentXSRFToken = "";
        this.storageUsed = 0;

        this.liteMode = false;
    }

    public User(ResultSet rs) throws SQLException {
        this();
        this.setValues(rs);
    }

    public User(ResultSet rs, boolean liteMode) throws SQLException {
        this();
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
            this.password = rs.getString("password") != null ? rs.getString("password") : "";
            this.salt = rs.getString("salt") != null ? rs.getString("salt") : "";
        }
        this.isExternal = rs.getString("password") == null && rs.getString("salt") == null;
        try {
            this.storageUsed = StorageManager.getUserStorageSpaceUsed(this);
        } catch (Exception e) {
        }
    }

    @Override
    public JsonObject toJsonObject() {
        JsonObjectBuilder builder = Json.createObjectBuilder()
            .add("idUser", "" + this.idUser)
            .add("idGuest", "" + this.idGuest)
            .add("email", this.email)
            .add("isAdmin", this.isAdmin)
            .add("isGuest", this.isGuest)
            .add("isExternal", this.isExternal)
            .add("storageUsed", this.storageUsed);
        if (!this.liteMode) {
            builder = builder.add("xsrfToken", this.currentXSRFToken);
        }
        return builder.build();
    }

    public static User newGuestUser() {
        User guest = new User();
        guest.idGuest = Instant.now().getEpochSecond();
        guest.isGuest = true;
        return guest;
    }

    public static User getGuestUser(long idGuest) {
        User guest = new User();
        guest.idGuest = idGuest;
        guest.isGuest = true;
        return guest;
    }
}
