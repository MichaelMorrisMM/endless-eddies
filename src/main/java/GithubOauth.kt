import com.fasterxml.jackson.annotation.JsonInclude

class OkHttpConstants {
    companion object {
        val JSON_MEDIA_TYPE = okhttp3.MediaType.parse("application/json; charset=utf-8")
    }
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GithubOauthRequestBody(
    val client_id: String,
    val client_secret: String,
    val code: String,
    val redirect_uri: String? = null,
    val state: String? = null
) {
    fun toJson(): String = Singletons.getObjectMapper().writeValueAsString(this)
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GithubOauthResponseBody(
    val access_token: String,
    val token_type: String? = null,
    val scope: String? = null
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class GithubEmail(
    val email: String,
    val verified: Boolean,
    val primary: Boolean,
    val visibility: String? = null
)

class Github {
    companion object {
        // Headers
        const val ACCEPT_HEADER_KEY = "Accept"
        const val ACCEPT_HEADER_VALUE = "application/json"
        const val AUTHORIZATION_HEADER_KEY = "Authorization"
        const val AUTHORIZATION_HEADER_VALUE_PREFIX = "token "

        // URLs
        const val API_URL_ACCESS_TOKEN = "https://github.com/login/oauth/access_token"
        const val API_URL_EMAILS = "https://api.github.com/user/emails"
        const val API_URL_SCHEME = "https"
        const val API_URL_HOSTNAME = "github.com"
        const val API_URL_OAUTH_AUTHORIZE_PATH = "login/oauth/authorize"

        // API objects
        const val CLIENT_ID_KEY = "client_id"
        const val SCOPE_KEY = "scope"
        const val USER_EMAIL_SCOPE = "user:email"
        const val STATE_KEY = "state"
        const val CODE_KEY = "code"

        // Environment Variables
        const val CLIENT_ID_ENV_KEY = "EE_CLIENT_ID"
        const val CLIENT_SECRET_ENV_KEY = "EE_CLIENT_SECRET"

        fun getUserAccessToken(code: String): String {
            val githubOauthRequestBody = GithubOauthRequestBody(
                System.getenv(CLIENT_ID_ENV_KEY),
                System.getenv(CLIENT_SECRET_ENV_KEY),
                code
            )

            val githubRequest = okhttp3.Request.Builder()
                .url(API_URL_ACCESS_TOKEN)
                .addHeader(ACCEPT_HEADER_KEY, ACCEPT_HEADER_VALUE)
                .post(
                    okhttp3.RequestBody.create(
                        OkHttpConstants.JSON_MEDIA_TYPE,
                        githubOauthRequestBody.toJson()
                    )
                )
                .build()

            return Singletons.getOkHttpClient().newCall(githubRequest).execute().use { githubResponse ->
                Singletons.getObjectMapper()
                    .readValue(
                        githubResponse.body()!!.string(),
                        GithubOauthResponseBody::class.java
                    ).access_token
            }
        }

        fun getUserPrimaryEmail(accessToken: String): String {
            val userEmails = mutableListOf<GithubEmail>()

            val githubRequest = okhttp3.Request.Builder()
                .url(API_URL_EMAILS)
                .addHeader(
                    AUTHORIZATION_HEADER_KEY,
                    AUTHORIZATION_HEADER_VALUE_PREFIX + accessToken
                )
                .build()

            userEmails.addAll(
                Singletons.getOkHttpClient().newCall(githubRequest).execute().use { githubResponse ->
                    Singletons.getObjectMapper()
                        .readValue<List<GithubEmail>>(
                            githubResponse.body()!!.string(),
                            Singletons
                                .getObjectMapper()
                                .typeFactory
                                .constructCollectionType(List::class.java, GithubEmail::class.java)
                        )
                }
            )

            return userEmails.first { it.primary }.email
        }
    }
}

