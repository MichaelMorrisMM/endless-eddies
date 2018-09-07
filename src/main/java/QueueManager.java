import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.locks.ReentrantLock;

public class QueueManager {

    private ArrayBlockingQueue<Command> queue;
    private ReentrantLock executionLock = new ReentrantLock(true);

    public QueueManager() {
        this.queue = new ArrayBlockingQueue<>(100, true);
    }

    public boolean tryAddingCommands(List<Command> commands) {
        for (Command c : commands) {
            if (!this.queue.offer(c)) {
                return false;
            }
        }
        return true;
    }

    public void initiate() {
        if (!this.executionLock.isLocked()) {
            this.execute();
        }
    }

    private void execute() {
        this.executionLock.lock();
        try {
            Command c;
            while ((c = this.queue.poll()) != null) {
                File tmpDir = new File(ConfiguratorServlet.ROOT_PATH + File.separator + c.requestName);
                tmpDir.mkdir();

                File inFile = new File(tmpDir, "" + c.executeOrder + GetRequestServlet.IN_FILE);
                inFile.createNewFile();
                File outFile = new File(tmpDir, "" + c.executeOrder + GetRequestServlet.OUT_FILE);
                outFile.createNewFile();
                File errorFile = new File(tmpDir, "" + c.executeOrder + GetRequestServlet.ERROR_FILE);
                errorFile.createNewFile();
                File applicationDefinitionFile = new File(tmpDir, GetRequestServlet.APPLICATION_DEFINITION_FILE);
                if (applicationDefinitionFile.createNewFile()) {
                    try (BufferedWriter writer = new BufferedWriter(new FileWriter(applicationDefinitionFile))) {
                        writer.write(c.application.toJsonObject().toString());
                    }
                }

                Process process = c.execute(inFile, outFile, errorFile, tmpDir);
                process.waitFor();

                if (c.isLastOfGroup) {
                    if (c.user.isGuest) {
                        DatabaseConnector.createNewGuestRequest(c.requestName, c.user.idGuest);
                    } else {
                        DatabaseConnector.createNewRequest(c.requestName, c.user.idUser);
                    }
                }
            }
        } catch (Exception e) {
        } finally {
            this.executionLock.unlock();
        }
    }

}
