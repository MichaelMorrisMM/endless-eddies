import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.kotlin.KotlinModule;
import okhttp3.OkHttpClient;

public class Singletons {
    private static ObjectMapper objectMapper = new ObjectMapper().registerModule(new KotlinModule());
    private static OkHttpClient okHttpClient = new OkHttpClient();

    public static ObjectMapper getObjectMapper() {
        return objectMapper;
    }

    public static OkHttpClient getOkHttpClient() {
        return okHttpClient;
    }
}
