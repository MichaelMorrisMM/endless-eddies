import java.sql.ResultSet;
import java.sql.SQLException;

public interface DatabaseObject {

    void setValues(ResultSet rs) throws SQLException;

}
