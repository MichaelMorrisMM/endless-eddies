import javax.json.Json;
import javax.json.JsonObject;

public class SelectOption extends ConfigObject {

    public String value;
    public String display;

    public SelectOption() {
        this.value = "";
        this.display = "";
    }

    public SelectOption(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(DISPLAY, this.display)
            .add(VALUE, this.value)
            .build();
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.value = Util.getStringSafeNonNull(obj, VALUE);
            this.display = Util.getStringSafeNonNull(obj, DISPLAY);
            return true;
        }
        return false;
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String value = Util.getStringSafeNonNull(obj, VALUE);
            return !value.trim().equals("");
        }
        return false;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof SelectOption) {
            SelectOption otherAsSO = (SelectOption) other;
            return this.value.equals(otherAsSO.value) &&
                this.display.equals(otherAsSO.display);
        }
        return false;
    }

}
