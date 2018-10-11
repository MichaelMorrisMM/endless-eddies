import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.servlet.http.Part;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Scanner;
import java.util.concurrent.atomic.AtomicLong;

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

    public static void deleteRequestFiles(String requestName) throws IOException {
        deleteFile(ConfiguratorServlet.ROOT_PATH + File.separator + requestName);
    }

    /**
     * Delete a file or a directory and its children.
     *
     * @param pathString
     *            The string path of directory to delete.
     * @throws IOException
     *             Exception when problem occurs during deleting the directory.
     *
     * CREDIT: http://roufid.com/how-to-delete-folder-recursively-in-java/
     */
    public static void deleteFile(String pathString) throws IOException {
        Path directory = Paths.get(pathString);
        Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                Files.delete(file);
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                Files.delete(dir);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    /**
     * Attempts to calculate the size of a file or directory.
     *
     * Since the operation is non-atomic, the returned value may be inaccurate.
     * However, this method is quick and does its best.
     *
     * CREDIT: https://stackoverflow.com/questions/2149785/get-size-of-folder-or-file/19877372#19877372
     */
    public static long fileSize(String pathString) throws InvalidPathException, AssertionError {
        Path path = Paths.get(pathString);
        final AtomicLong size = new AtomicLong(0);
        try {
            Files.walkFileTree(path, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                    size.addAndGet(attrs.size());
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) {
                    //System.out.println("skipped: " + file + " (" + exc + ")");
                    // Skip folders that can't be traversed
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) {
                    //if (exc != null) {
                    //    System.out.println("had trouble traversing: " + dir + " (" + exc + ")");
                    //}
                    // Ignore errors traversing a folder
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            throw new AssertionError("walkFileTree will not throw IOException if the FileVisitor does not");
        }
        return size.get();
    }

    public static boolean parseFlagParameter(String val) {
        return val.equals("true");
    }

    public static String parseStringParameter(JsonValue val) {
        return ((JsonString) val).getString();
    }

}
