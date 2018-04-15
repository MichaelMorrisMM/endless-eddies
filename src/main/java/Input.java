import javax.json.JsonNumber;
import javax.json.JsonValue;

public class Input {

    public String code;
    public String value;

    public Input(String code, String type, JsonValue value) {
        if (code != null) {
            String trimmedCode = code.trim();
            if (!trimmedCode.equals("")) {
                this.code = trimmedCode;
            }
        }

        this.value = this.parseValue(type, value);
    }

    private String parseValue(String type, JsonValue val) {
        switch (type) {
            case ConfigSettings.TYPE_FLAG: return val.equals(JsonValue.TRUE) ? "Y" : "N";
            case ConfigSettings.TYPE_STRING: return val.toString();
            case ConfigSettings.TYPE_INTEGER: return "" + ((JsonNumber) val).longValueExact();
            case ConfigSettings.TYPE_FLOAT: return "" + ((JsonNumber) val).doubleValue();
            default: return val.toString();
        }
    }

    public boolean hasCode() {
        return this.code != null;
    }

}
