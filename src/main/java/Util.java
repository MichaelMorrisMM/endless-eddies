import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonString;
import javax.json.JsonValue;
import java.io.File;

public class Util {

    public static String getStringSafe(JsonObject obj, String key) {
        if (obj != null) {
            JsonValue val = obj.get(key);
            if (val != null && !val.equals(JsonValue.NULL) && val.getValueType().equals(JsonValue.ValueType.STRING)) {
                return ((JsonString) val).getString();
            }
        }
        return null;
    }

    public static String getStringSafeNonNull(JsonObject obj, String key) {
        String val = getStringSafe(obj, key);
        return val != null ? val : "";
    }

    public static String stringNonNull(String s) {
        return s != null ? s : "";
    }

    public static boolean isNonEmpty(String s) {
        return s != null && !s.trim().equals("");
    }

    public static JsonArray getArraySafe(JsonObject obj, String key) {
        try {
            if (obj != null) {
                return obj.getJsonArray(key);
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    public static JsonValue getJsonBoolean(boolean b) {
        return b ? JsonValue.TRUE : JsonValue.FALSE;
    }

    public static void deleteRequestFiles(String requestName) {
        recursivelyDeleteFile(new File(ConfiguratorServlet.ROOT_PATH + File.separator + requestName));
    }

    public static void recursivelyDeleteFile(File file) {
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    recursivelyDeleteFile(child);
                }
            }
        }
        file.delete();
    }

}
