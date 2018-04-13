import javax.json.Json;
import javax.json.JsonObject;

public class Parameter extends ConfigObject {

    public String name;
    public String type;

    public Parameter() {
        this.name = "";
        this.type = "";
    }

    public Parameter(String n, String t) {
        this.name = n;
        this.type = t;
    }

    public Parameter(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = obj.getString(NAME);
            this.type = obj.getString(TYPE);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String name = obj.getString(NAME);
            String type = obj.getString(TYPE);
            return name != null && type != null && ConfigSettings.isValidType(type);
        }
        return false;
    }

}
