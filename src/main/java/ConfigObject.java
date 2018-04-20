import javax.json.JsonObject;

public abstract class ConfigObject {

    public static final String NAME = "name";
    public static final String VALUE = "value";
    public static final String GROUP = "group";
    public static final String TYPE = "type";
    public static final String CODE = "code";
    public static final String SORT_ORDER = "sortOrder";
    public static final String TOOL_TIP = "toolTip";

    public static final int DEFAULT_SORT_ORDER = 1;

    public abstract JsonObject toJsonObject();
    public abstract boolean updateWith(JsonObject obj);

}
