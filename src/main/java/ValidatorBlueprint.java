import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import java.util.ArrayList;
import java.util.List;

public class ValidatorBlueprint {

    public String name;
    public String validatorType;
    public List<String> appliesTo;
    public boolean requiresValue;

    public ValidatorBlueprint(String n, String vt, boolean r, String... at) {
        this.name = n;
        this.validatorType = vt;
        this.appliesTo = new ArrayList<>();
        this.requiresValue = r;
        for (String s : at) {
            this.appliesTo.add(s);
        }
    }

    public JsonObject toJsonObject() {
        JsonArrayBuilder appliesToBuilder = Json.createArrayBuilder();
        for (String s : this.appliesTo) {
            appliesToBuilder = appliesToBuilder.add(s);
        }

        return Json.createObjectBuilder()
            .add(ConfigObject.NAME, this.name)
            .add(ConfigObject.VALIDATOR_TYPE, this.validatorType)
            .add(ConfigObject.REQUIRES_VALUE, Util.getJsonBoolean(this.requiresValue))
            .add(ConfigObject.APPLIES_TO, appliesToBuilder.build())
            .build();
    }

}
