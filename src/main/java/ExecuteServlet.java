import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@WebServlet("/execute")
@MultipartConfig
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
            Application application = config.getApplication(request.getParameter(ConfigSettings.TARGET_APPLICATION));

            if (application != null) {
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
                        if (isParentNotPresent(param, request)) {
                            continue;
                        }
                        String validationError = checkParameterValidation(param, request);
                        if (validationError != null) {
                            HttpUtil.printPOSTResult(response, false, validationError);
                            return;
                        }
                        inputs.add(new Input(param, request));
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

    private static boolean isParentNotPresent(Parameter param, HttpServletRequest request) {
        if (!param.parentString.equals("")) {
            String parentValue = request.getParameter(param.parentString);
            if (parentValue == null || parentValue.equals("") || !parentValue.equals(param.parentOption)) {
                return true;
            }
        }
        return false;
    }

    private static String checkParameterValidation(Parameter param, HttpServletRequest request) {
        try {
            if (param.validators.size() > 0) {
                String val = request.getParameter(param.name);
                Part part = request.getPart(param.name);
                boolean valIsNull;
                if (param.type.equals(ConfigSettings.TYPE_FILE)) {
                    valIsNull = part.getSize() == 0;
                } else {
                    valIsNull = val.equals("");
                }
                if (param.type.equals(ConfigSettings.TYPE_FLAG)) {
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && (valIsNull || !Util.parseFlagParameter(val))) {
                            return printValidationError(param, "Required");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_STRING)) {
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && valIsNull) {
                            return printValidationError(param, "Required");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MIN_LENGTH) && (val.equals("") || val.length() < Long.parseLong(Util.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Minimum length not met");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MAX_LENGTH) && !val.equals("") && val.length() > Long.parseLong(Util.parseStringParameter(validator.value))) {
                            return printValidationError(param, "Maximum length exceeded");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REGEX) && (val.equals("") || !val.matches(Util.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Fails to match regular expression");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_INTEGER)) {
                    Long parsedValue = valIsNull ? null : Long.parseLong(val);
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && parsedValue == null) {
                            return printValidationError(param, "Required");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MIN) && (parsedValue == null || parsedValue < Long.parseLong(Util.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Minimum not met");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MAX) && parsedValue != null && parsedValue > Long.parseLong(Util.parseStringParameter(validator.value))) {
                            return printValidationError(param, "Maximum exceeded");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MOD) && (parsedValue == null || parsedValue % Long.parseLong(Util.parseStringParameter(validator.value)) != 0)) {
                            return printValidationError(param, "Modulo validation not met");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_FLOAT)) {
                    Double parsedValue = valIsNull ? null : Double.parseDouble(val);
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && parsedValue == null) {
                            return printValidationError(param, "Required");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MIN) && (parsedValue == null || parsedValue < Double.parseDouble(Util.parseStringParameter(validator.value)))) {
                            return printValidationError(param, "Minimum not met");
                        } else if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_MAX) && parsedValue != null && parsedValue > Double.parseDouble(Util.parseStringParameter(validator.value))) {
                            return printValidationError(param, "Maximum exceeded");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_SELECT)) {
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && valIsNull) {
                            return printValidationError(param, "Required");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_MULTI_SELECT)) {
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && valIsNull) {
                            return printValidationError(param, "Required");
                        }
                    }
                } else if (param.type.equals(ConfigSettings.TYPE_FILE)) {
                    for (Validator validator : param.validators) {
                        if (validator.validatorType.equals(ValidatorsServlet.VALIDATOR_TYPE_REQUIRED) && valIsNull) {
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
