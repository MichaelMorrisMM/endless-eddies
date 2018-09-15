import javax.json.JsonObject;

public abstract class ConfigObject {

    public static final String NAME = "name";
    public static final String VALUE = "value";
    public static final String GROUP = "group";
    public static final String TYPE = "type";
    public static final String CODE = "code";
    public static final String SORT_ORDER = "sortOrder";
    public static final String TOOL_TIP = "toolTip";
    public static final String VALIDATOR_TYPE = "validatorType";
    public static final String MESSAGE = "message";
    public static final String APPLIES_TO = "appliesTo";
    public static final String VALIDATORS = "validators";
    public static final String REQUIRES_VALUE = "requiresValue";
    public static final String SELECT_OPTIONS = "selectOptions";
    public static final String FILE_NAME = "filename";
    public static final String X_AXIS_LABEL = "xAxisLabel";
    public static final String Y_AXIS_LABEL = "yAxisLabel";
    public static final String RESULTS = "results";
    public static final String COLOR_SCHEME = "colorScheme";
    public static final String TITLE = "title";
    public static final String CONTENT = "content";
    public static final String PARAMETERS = "parameters";
    public static final String COMMAND = "command";
    public static final String PARENT_STRING = "parentString";
    public static final String PARENT_OPTION = "parentOption";

    public static final int DEFAULT_SORT_ORDER = 1;

    public abstract JsonObject toJsonObject();
    public abstract boolean updateWith(JsonObject obj);

}
