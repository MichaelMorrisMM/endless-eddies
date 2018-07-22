import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Command {

    public static final String commandDelimiter = " ";

    private List<String> command;
    private List<Input> inputs;

    public Application application;
    public String requestName;
    public User user;

    public Command(List<Input> inputs, Application application, String requestName, User user) {
        this.command = new ArrayList<>(Arrays.asList(application.command.split(commandDelimiter)));
        this.inputs = inputs;
        this.application = application;
        this.requestName = requestName;
        this.user = user;
    }

    private ProcessBuilder getBuilder() {
        for (Input input : inputs) {
            if (input.hasCodeToInsert()) {
                this.command.add(input.code);
            }
            if (input.hasValue()) {
                this.command.add(input.value);
            }
        }

        return new ProcessBuilder(command)
            .directory(new File(ConfiguratorServlet.ROOT_PATH));
    }

    public Process execute(File in, File out, File error, File dir) throws IOException {
        return this.getBuilder()
            .redirectInput(in)
            .redirectOutput(out)
            .redirectError(error)
            .directory(dir)
            .start();
    }

}
