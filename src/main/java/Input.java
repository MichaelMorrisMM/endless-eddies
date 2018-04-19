import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonValue;

public class Input {

    public String code;
    public String value;
    public String type;

    public Input(String name, String code, String type, JsonValue value, JsonObject obj) {
        if (code != null) {
            String trimmedCode = code.trim();
            if (!trimmedCode.equals("")) {
                this.code = trimmedCode;
            }
        }

        this.type = type;
        this.value = this.parseValue(name, value, obj);
    }

    private String parseValue(String name, JsonValue val, JsonObject obj) {
        String codeNonNull = this.code != null ? this.code : "";
        switch (this.type) {
            case ConfigSettings.TYPE_FLAG: return val.equals(JsonValue.TRUE) ? codeNonNull : "";
            case ConfigSettings.TYPE_STRING: return obj.getString(name);
            case ConfigSettings.TYPE_INTEGER: return "" + ((JsonNumber) val).longValueExact();
            case ConfigSettings.TYPE_FLOAT: return "" + ((JsonNumber) val).doubleValue();
            default: return val.toString();
        }
    }

    public boolean hasCodeToInsert() {
        if (this.type.equals(ConfigSettings.TYPE_FLAG)) {
            return false;
        }

        return this.code != null;
    }

    public boolean hasValue() {
        return this.value != null && !this.value.equals("");
    }

}
