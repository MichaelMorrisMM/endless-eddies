import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonString;
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
                    case ConfigSettings.TYPE_FLAG: return parseFlagParameter(val) ? this.code : "";
                    case ConfigSettings.TYPE_STRING: return parseStringParameter(val);
                    case ConfigSettings.TYPE_INTEGER: return "" + parseIntegerParameter(val);
                    case ConfigSettings.TYPE_FLOAT: return "" + parseFloatParameter(val);
                    case ConfigSettings.TYPE_SELECT: return parseStringParameter(val);
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

    public static boolean parseFlagParameter(JsonValue val) {
        return val.equals(JsonValue.TRUE);
    }

    public static String parseStringParameter(JsonValue val) {
        return ((JsonString) val).getString();
    }

    public static long parseIntegerParameter(JsonValue val) {
        return ((JsonNumber) val).longValueExact();
    }

    public static double parseFloatParameter(JsonValue val) {
        return ((JsonNumber) val).doubleValue();
    }

}
