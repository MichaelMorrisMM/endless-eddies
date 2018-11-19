import javax.json.JsonObject;

public abstract class ConfigObject {

    public static final String NAME = "name";
    static final String VALUE = "value";
    static final String TYPE = "type";
    static final String CODE = "code";
    static final String SORT_ORDER = "sortOrder";
    static final String TOOL_TIP = "toolTip";
    public static final String VALIDATOR_TYPE = "validatorType";
    static final String MESSAGE = "message";
    public static final String APPLIES_TO = "appliesTo";
    static final String VALIDATORS = "validators";
    public static final String REQUIRES_VALUE = "requiresValue";
    static final String SELECT_OPTIONS = "selectOptions";
    static final String FILE_NAME = "filename";
    static final String X_AXIS_LABEL = "xAxisLabel";
    static final String Y_AXIS_LABEL = "yAxisLabel";
    static final String COLOR_SCHEME = "colorScheme";
    static final String TITLE = "title";
    static final String CONTENT = "content";
    static final String PARAMETERS = "parameters";
    static final String COMMAND = "command";
    static final String PARENT_STRING = "parentString";
    static final String PARENT_OPTION = "parentOption";
    static final String PRIMARY_COLOR = "primaryColor";
    static final String INVERT_PRIMARY = "invertPrimary";
    static final String ACCENT_COLOR = "accentColor";
    static final String INVERT_ACCENT = "invertAccent";
    static final String WARN_COLOR = "warnColor";
    static final String INVERT_WARN = "invertWarn";
    static final String DISPLAY = "display";
    static final String DISPLAY_INLINE = "displayInline";

    static final int DEFAULT_SORT_ORDER = 1;

    public abstract JsonObject toJsonObject();
    public abstract boolean updateWith(JsonObject obj);

}
