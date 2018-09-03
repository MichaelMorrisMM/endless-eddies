import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/validators")
public class ValidatorsServlet extends HttpServlet {
    public static final String VALIDATOR_TYPE_REQUIRED = "required";
    public static final String VALIDATOR_TYPE_MIN = "min";
    public static final String VALIDATOR_TYPE_MAX = "max";
    public static final String VALIDATOR_TYPE_MIN_LENGTH = "minlength";
    public static final String VALIDATOR_TYPE_MAX_LENGTH = "maxlength";
    public static final String VALIDATOR_TYPE_REGEX = "pattern";

    public static List<ValidatorBlueprint> blueprints;
    static {
        blueprints = new ArrayList<>();
        blueprints.add(new ValidatorBlueprint("Required", VALIDATOR_TYPE_REQUIRED, false,
            ConfigSettings.TYPE_FLAG, ConfigSettings.TYPE_FLOAT, ConfigSettings.TYPE_INTEGER, ConfigSettings.TYPE_STRING, ConfigSettings.TYPE_SELECT));
        blueprints.add(new ValidatorBlueprint("Minimum", VALIDATOR_TYPE_MIN, true,
            ConfigSettings.TYPE_INTEGER, ConfigSettings.TYPE_FLOAT));
        blueprints.add(new ValidatorBlueprint("Maximum", VALIDATOR_TYPE_MAX, true,
            ConfigSettings.TYPE_INTEGER, ConfigSettings.TYPE_FLOAT));
        blueprints.add(new ValidatorBlueprint("Minimum length", VALIDATOR_TYPE_MIN_LENGTH, true,
            ConfigSettings.TYPE_STRING));
        blueprints.add(new ValidatorBlueprint("Maximum length", VALIDATOR_TYPE_MAX_LENGTH, true,
            ConfigSettings.TYPE_STRING));
        blueprints.add(new ValidatorBlueprint("String must match regex pattern", VALIDATOR_TYPE_REGEX, true,
            ConfigSettings.TYPE_STRING));
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = SessionManager.checkAdminSession(request);
        if (user == null) {
            HttpUtil.printJSONArray(response, Json.createArrayBuilder().build());
            return;
        }

        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (ValidatorBlueprint blueprint : blueprints) {
            builder = builder.add(blueprint.toJsonObject());
        }

        HttpUtil.printJSONArray(response, builder.build());
    }

    public static boolean isValidValidatorType(String s) {
        if (s != null) {
            for (ValidatorBlueprint blueprint : blueprints) {
                if (blueprint.validatorType.equals(s)) {
                    return true;
                }
            }
        }
        return false;
    }

}
