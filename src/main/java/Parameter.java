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
    public List<SelectOption> selectOptions;
    public String parentString;
    public String parentOption;

    public Parameter() {
        this.name = "";
        this.type = "";
        this.code = "";
        this.sortOrder = DEFAULT_SORT_ORDER;
        this.toolTip = "";
        this.validators = new ArrayList<>();
        this.selectOptions = new ArrayList<>();
        this.parentString = "";
        this.parentOption = "";
    }

    public Parameter(String n, String t, String c, int so, String tt, List<Validator> validators, List<SelectOption> selectOptions, String ps, String po) {
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
        this.parentString = ps;
        this.parentOption = po;
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
                for (JsonObject opt : optionsArray.getValuesAs(JsonObject.class)) {
                    SelectOption option = new SelectOption();
                    if (option.updateWith(opt)) {
                        this.selectOptions.add(option);
                    }
                }
            }
            this.parentString = Util.getStringSafeNonNull(obj, PARENT_STRING);
            this.parentOption = Util.getStringSafeNonNull(obj, PARENT_OPTION);
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
        for (SelectOption opt : this.selectOptions) {
            optionsBuilder = optionsBuilder.add(opt.toJsonObject());
        }

        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(TYPE, this.type)
            .add(CODE, this.code)
            .add(SORT_ORDER, this.sortOrder)
            .add(TOOL_TIP, this.toolTip)
            .add(VALIDATORS, validatorsBuilder.build())
            .add(SELECT_OPTIONS, optionsBuilder.build())
            .add(PARENT_STRING, this.parentString)
            .add(PARENT_OPTION, this.parentOption)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        if (obj != null) {
            String name = Util.getStringSafe(obj, NAME);
            String type = Util.getStringSafe(obj, TYPE);
            if (type != null && (type.equals(ConfigSettings.TYPE_SELECT) || type.equals(ConfigSettings.TYPE_MULTI_SELECT))) {
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
                && this.selectOptions.equals(otherAsP.selectOptions) && this.parentString.equals(otherAsP.parentString)
                && this.parentOption.equals(otherAsP.parentOption);
        }
        return false;
    }

}
