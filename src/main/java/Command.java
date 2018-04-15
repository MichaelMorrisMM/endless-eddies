import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Command {

    public static final String commandDelimiter = " ";

    private List<String> command;
    private List<Input> inputs;

    public Command(String command, List<Input> inputs) {
        this.command = new ArrayList<>(Arrays.asList(command.split(commandDelimiter)));
        this.inputs = inputs;
    }

    private ProcessBuilder getBuilder() {
        for (Input input : inputs) {
            if (input.hasCode()) {
                this.command.add(input.code);
            }
            this.command.add(input.value);
        }

        return new ProcessBuilder(command)
            .directory(new File(ConfiguratorServlet.ROOT_PATH));
    }

    public Process execute(ProcessBuilder.Redirect in, ProcessBuilder.Redirect out, ProcessBuilder.Redirect error) throws IOException {
        return this.getBuilder()
            .redirectInput(in)
            .redirectOutput(out)
            .redirectError(error)
            .start();
    }

    public Process execute(File in, File out, File error) throws IOException {
        return this.getBuilder()
            .redirectInput(in)
            .redirectOutput(out)
            .redirectError(error)
            .start();
    }

}
