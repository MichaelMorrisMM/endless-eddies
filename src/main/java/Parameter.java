import javax.json.Json;
import javax.json.JsonObject;

public class Parameter extends ConfigObject {

    public String name;
    public String type;
    public String code;
    public int sortOrder;

    public Parameter() {
        this.name = "";
        this.type = "";
        this.code = "";
        this.sortOrder = 1;
    }

    public Parameter(String n, String t, String c, int so) {
        this.name = n;
        this.type = t;
        this.code = c;
        this.sortOrder = so;
    }

    public Parameter(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = obj.getString(NAME);
            this.type = obj.getString(TYPE);
            this.code = obj.getString(CODE);
            this.sortOrder = obj.getInt(SORT_ORDER);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .add(CODE, this.code)
            .add(SORT_ORDER, this.sortOrder)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String name = obj.getString(NAME);
            String type = obj.getString(TYPE);
            String code = obj.getString(CODE);
            int sortOrder = obj.getInt(SORT_ORDER);
            return name != null && type != null && ConfigSettings.isValidType(type) && code != null && sortOrder > 0;
        }
        return false;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof Parameter) {
            Parameter otherAsP = (Parameter) other;
            return this.name.equals(otherAsP.name) && this.type.equals(otherAsP.type)
                && this.code.equals(otherAsP.code) && this.sortOrder == otherAsP.sortOrder;
        }
        return false;
    }

}
