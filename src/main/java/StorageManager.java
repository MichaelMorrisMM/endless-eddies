import java.io.IOException;

public class StorageManager {

    public static long getUserStorageSpaceUsed(User user) throws Exception {
        long usedSpace = 0;
        for (Request req : DatabaseConnector.getRequestsList(user)) {
            usedSpace += req.getSize();
        }
        return usedSpace;
    }

    public static boolean userStorageLimitExceeded(User user) throws IOException {
        long limit = ConfiguratorServlet.getCurrentConfig().userStorageLimit;
        if (limit == 0 || user.isAdmin) {
            return false;
        }
        try {
            return getUserStorageSpaceUsed(user) > limit;
        } catch (Exception e) {
            return true;
        }
    }

}
