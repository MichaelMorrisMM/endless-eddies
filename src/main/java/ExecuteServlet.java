import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@WebServlet("/execute")
public class ExecuteServlet extends HttpServlet {

    public static QueueManager queueManager = new QueueManager();

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = HttpUtil.checkForUserSessionAllowingForGuest(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "No user session");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }
        if (StorageManager.userStorageLimitExceeded(user)) {
            HttpUtil.printPOSTResult(response, false, "Storage limit exceeded. Please delete previous request(s) before submitting a new one");
            return;
        }

        try {
            ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
            JsonObject requestObject;
            try (JsonReader reader = Json.createReader(request.getReader())) {
                requestObject = reader.readObject();
            }
            Application application = config.getApplication(Util.getStringSafe(requestObject, ConfigSettings.TARGET_APPLICATION));

            if (requestObject != null && application != null) {
                String requestName;
                if (user.isGuest) {
                    requestName = "guest_" + UUID.randomUUID().toString().replace("-", "");
                } else {
                    requestName = "" + user.idUser + "_" + UUID.randomUUID().toString().replace("-", "");
                }

                List<Command> commands = new ArrayList<>();
                for (int i = 0; i < application.commandGroups.size(); i++) {
                    CommandGroup commandGroup = application.commandGroups.get(i);
                    List<Input> inputs = new ArrayList<>();
                    for (Parameter param : commandGroup.getParameters()) {
                        String validationError = checkParameterValidation(param, requestObject);
                        if (validationError != null) {
                            HttpUtil.printPOSTResult(response, false, validationError);
                            return;
                        }
                        inputs.add(new Input(param, requestObject));
                    }
                    commands.add(new Command(commandGroup.command, i, i == application.commandGroups.size() - 1, inputs, application, requestName, user));
                }

                if (ExecuteServlet.queueManager.tryAddingCommands(commands)) {
                    ExecuteServlet.queueManager.initiate();
                    HttpUtil.printPOSTResult(response, true, requestName);
                } else {
                    HttpUtil.printPOSTResult(response, false, "Execution queue is temporarily full, please try again later");
                }
            } else {
                HttpUtil.printPOSTResult(response, false, "");
            }
        } catch (Exception e) {
            HttpUtil.printPOSTResult(response, false, "An error occurred");
        }
    }

    private static String checkParameterValidation(Parameter param, JsonObject requestObject) {
        try {
            if (param.validators.size() > 0) {
                JsonValue val = requestObject.get(param.name);
                boolean valIsNull = val == null || val.equals(JsonValue.NULL);
                if (param.type.equals(ConfigSettings.TYPE_FLAG)) {
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && (valIsNull || !Input.parseFlagParameter(val))) {
                            return printValidationError(param, "Required");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_STRING)) {
                    String parsedValue = valIsNull ? null : Input.parseStringParameter(val);
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && (parsedValue == null || parsedValue.equals(""))) {
                            return printValidationError(param, "Required");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MIN_LENGTH) && (parsedValue == null || parsedValue.length() < Long.parseLong(Input.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Minimum length not met");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MAX_LENGTH) && parsedValue != null && parsedValue.length() > Long.parseLong(Input.parseStringParameter(validator.value))) {
                            return printValidationError(param, "Maximum length exceeded");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REGEX) && (parsedValue == null || !parsedValue.matches(Input.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Fails to match regular expression");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_INTEGER)) {
                    Long parsedValue = valIsNull ? null : Input.parseIntegerParameter(val);
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && parsedValue == null) {
                            return printValidationError(param, "Required");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MIN) && (parsedValue == null || parsedValue < Long.parseLong(Input.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Minimum not met");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MAX) && parsedValue != null && parsedValue > Long.parseLong(Input.parseStringParameter(validator.value))) {
                            return printValidationError(param, "Maximum exceeded");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MOD) && (parsedValue == null || parsedValue % Long.parseLong(Input.parseStringParameter(validator.value)) != 0)) {
                            return printValidationError(param, "Modulo validation not met");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_FLOAT)) {
                    Double parsedValue = valIsNull ? null : Input.parseFloatParameter(val);
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && parsedValue == null) {
                            return printValidationError(param, "Required");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MIN) && (parsedValue == null || parsedValue < Double.parseDouble(Input.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Minimum not met");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MAX) && parsedValue != null && parsedValue > Double.parseDouble(Input.parseStringParameter(validator.value))) {
                            return printValidationError(param, "Maximum exceeded");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_SELECT)) {
                    String parsedValue = valIsNull ? null : Input.parseStringParameter(val);
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && (parsedValue == null || parsedValue.equals(""))) {
                            return printValidationError(param, "Required");
                        }
                    }
                }
            }
        } catch (Exception e) {
            return "An error occurred while validating parameters";
        }
        return null;
    }

    private static String printValidationError(Parameter param, String error) {
        return "Validation Error for " + param.name + ": " + error;
    }

}
