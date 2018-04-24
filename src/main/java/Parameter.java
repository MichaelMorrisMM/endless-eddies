import javax.json.*;
import java.util.ArrayList;
import java.util.List;

public class Parameter extends ConfigObject {

    public String name;
    public String type;
    public String code;
    public int sortOrder;
    public String toolTip;
    public List<Validator> validators;
    public List<String> selectOptions;

    public Parameter() {
        this.name = "";
        this.type = "";
        this.code = "";
        this.sortOrder = DEFAULT_SORT_ORDER;
        this.toolTip = "";
        this.validators = new ArrayList<>();
        this.selectOptions = new ArrayList<>();
    }

    public Parameter(String n, String t, String c, int so, String tt, List<Validator> validators, List<String> selectOptions) {
        this.name = n;
        this.type = t;
        this.code = c;
        this.sortOrder = so;
        this.toolTip = tt;
        if (validators != null) {
            this.validators = validators;
        }
        if (selectOptions != null) {
            this.selectOptions = selectOptions;
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
            JsonArray optionsArray = Util.getArraySafe(obj, SELECT_OPTIONS);
            if (optionsArray != null) {
                this.selectOptions = new ArrayList<>();
                for (JsonString opt : optionsArray.getValuesAs(JsonString.class)) {
                    this.selectOptions.add(opt.getString());
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

        JsonArrayBuilder optionsBuilder = Json.createArrayBuilder();
        for (String opt : this.selectOptions) {
            optionsBuilder = optionsBuilder.add(opt);
        }

        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .add(CODE, this.code)
            .add(SORT_ORDER, this.sortOrder)
            .add(TOOL_TIP, this.toolTip)
            .add(VALIDATORS, validatorsBuilder.build())
            .add(SELECT_OPTIONS, optionsBuilder.build())
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String name = Util.getStringSafe(obj, NAME);
            String type = Util.getStringSafe(obj, TYPE);
            if (type != null && type.equals(ConfigSettings.TYPE_SELECT)) {
                JsonArray optionsArray = Util.getArraySafe(obj, SELECT_OPTIONS);
                if (optionsArray == null || optionsArray.size() < 1) {
                    return false;
                }
            }
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
                && this.toolTip.equals(otherAsP.toolTip) && this.validators.equals(otherAsP.validators)
                && this.selectOptions.equals(otherAsP.selectOptions);
        }
        return false;
    }

}
