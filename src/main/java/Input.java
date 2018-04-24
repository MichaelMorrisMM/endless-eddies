import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonValue;

public class Input {

    public String code;
    public String value;
    public String type;

    public Input() {
        this.code = "";
        this.value = "";
        this.type = "";
    }

    public Input(Parameter param, JsonObject requestObject) {
        this();

        this.code = param.code.trim();
        this.type = param.type;
        this.value = parseValue(param, requestObject);
    }

    private String parseValue(Parameter param, JsonObject obj) {
        try {
            JsonValue val = obj.get(param.name);
            if (val != null && !val.equals(JsonValue.NULL)) {
                switch (this.type) {
                    case ConfigSettings.TYPE_FLAG: return val.equals(JsonValue.TRUE) ? this.code : "";
                    case ConfigSettings.TYPE_STRING: return Util.getStringSafeNonNull(obj, param.name);
                    case ConfigSettings.TYPE_INTEGER: return "" + ((JsonNumber) val).longValueExact();
                    case ConfigSettings.TYPE_FLOAT: return "" + ((JsonNumber) val).doubleValue();
                    case ConfigSettings.TYPE_SELECT: return Util.getStringSafeNonNull(obj, param.name);
                }
            }
            return "";
        } catch (Exception e) {
            return "";
        }
    }

    public boolean hasCodeToInsert() {
        if (this.type.equals(ConfigSettings.TYPE_FLAG)) {
            return false;
        }

        return this.hasValue() && Util.isNonEmpty(this.code);
    }

    public boolean hasValue() {
        return Util.isNonEmpty(this.value);
    }

}
