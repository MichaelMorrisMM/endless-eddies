import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonValue;

public class Setting extends ConfigObject {

    public String name;
    public JsonValue value;
    public String group;
    public String type;

    public Setting() {
        this.name = "";
        this.value = JsonValue.NULL;
        this.group = "";
        this.type = "";
    }

    public Setting(String n, JsonValue value, String g, String t) {
        this.name = n;
        this.value = value;
        this.group = g;
        this.type = t;
    }

    public Setting(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = obj.getString(NAME);
            this.value = obj.get(VALUE);
            this.group = obj.getString(GROUP);
            this.type = obj.getString(TYPE);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(VALUE, this.value)
            .add(GROUP, this.group)
            .add(TYPE, this.type)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String name = obj.getString(NAME);
            JsonValue value = obj.get(VALUE);
            String group = obj.getString(GROUP);
            String type = obj.getString(TYPE);
            return name != null && value != null && group != null && ConfigSettings.isValidGroup(group)
                && type != null && ConfigSettings.isValidType(type);
        }
        return false;
    }

}
