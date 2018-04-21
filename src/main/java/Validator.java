import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonValue;

public class Validator extends ConfigObject {

    public String validatorType;
    public JsonValue value;
    public String message;

    public Validator() {
        this.validatorType = "";
        this.value = JsonValue.NULL;
        this.message = "";
    }

    public Validator(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(VALIDATOR_TYPE, this.validatorType)
            .add(VALUE, this.value)
            .add(MESSAGE, this.message)
            .build();
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.validatorType = Util.getStringSafeNonNull(obj, VALIDATOR_TYPE);
            this.value = obj.get(VALUE) != null ? obj.get(VALUE) : JsonValue.NULL;
            this.message = Util.getStringSafeNonNull(obj, MESSAGE);
            return true;
        }
        return false;
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String validatorType = Util.getStringSafe(obj, VALIDATOR_TYPE);
            JsonValue value = obj.get(VALUE);
            String message = Util.getStringSafe(obj, MESSAGE);
            return validatorType != null && ValidatorsServlet.isValidValidatorType(validatorType);
        }
        return false;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof Validator) {
            Validator otherAsV = (Validator) other;
            return this.validatorType.equals(otherAsV.validatorType) &&
                this.value.equals(otherAsV.value) && this.message.equals(otherAsV.message);
        }
        return false;
    }

}
