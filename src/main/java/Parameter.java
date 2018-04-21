import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import java.util.ArrayList;
import java.util.List;

public class Parameter extends ConfigObject {

    public String name;
    public String type;
    public String code;
    public int sortOrder;
    public String toolTip;
    public List<Validator> validators;

    public Parameter() {
        this.name = "";
        this.type = "";
        this.code = "";
        this.sortOrder = DEFAULT_SORT_ORDER;
        this.toolTip = "";
        this.validators = new ArrayList<>();
    }

    public Parameter(String n, String t, String c, int so, String tt, List<Validator> validators) {
        this.name = n;
        this.type = t;
        this.code = c;
        this.sortOrder = so;
        this.toolTip = tt;
        if (validators != null) {
            this.validators = validators;
        }
    }

    public Parameter(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = Util.getStringSafeNonNull(obj, NAME);
            this.type = Util.getStringSafeNonNull(obj, TYPE);
            this.code = Util.getStringSafeNonNull(obj, CODE);
            this.sortOrder = obj.getInt(SORT_ORDER, DEFAULT_SORT_ORDER);
            this.toolTip = Util.getStringSafeNonNull(obj, TOOL_TIP);
            JsonArray validatorsArray = Util.getArraySafe(obj, VALIDATORS);
            if (validatorsArray != null) {
                for (JsonObject validatorObj : validatorsArray.getValuesAs(JsonObject.class)) {
                    Validator validator = new Validator(validatorObj);
                    if (!validator.validatorType.equals("")) {
                        this.validators.add(validator);
                    }
                }
            }
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        JsonArrayBuilder validatorsBuilder = Json.createArrayBuilder();
        for (Validator validator : this.validators) {
            validatorsBuilder = validatorsBuilder.add(validator.toJsonObject());
        }

        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .add(CODE, this.code)
            .add(SORT_ORDER, this.sortOrder)
            .add(TOOL_TIP, this.toolTip)
            .add(VALIDATORS, validatorsBuilder.build())
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String name = Util.getStringSafe(obj, NAME);
            String type = Util.getStringSafe(obj, TYPE);
            String code = Util.getStringSafe(obj, CODE);
            int sortOrder = obj.getInt(SORT_ORDER, DEFAULT_SORT_ORDER);
            return name != null && type != null && ConfigSettings.isValidType(type) && code != null && sortOrder > 0;
        }
        return false;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof Parameter) {
            Parameter otherAsP = (Parameter) other;
            return this.name.equals(otherAsP.name) && this.type.equals(otherAsP.type)
                && this.code.equals(otherAsP.code) && this.sortOrder == otherAsP.sortOrder
                && this.toolTip.equals(otherAsP.toolTip) && this.validators.equals(otherAsP.validators);
        }
        return false;
    }

}
