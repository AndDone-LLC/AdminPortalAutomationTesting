import { request, APIRequestContext } from '@playwright/test';

export class AuthAPI {
    private baseURL: string;

    constructor() {
        this.baseURL = 'https://api.qat.anddone.com';
    }

    /**
     * Login via API and get authentication token/session
     * @param username - Username for login
     * @param password - Password for login
     * @returns Authentication response with token and cookies
     */
    async login(username: string, password: string) {
        const apiContext: APIRequestContext = await request.newContext();

        console.log('Attempting API login to: https://api.qat.anddone.com/users/sessions');
        console.log('Payload:', { userName: username, password: '***' });

        const response = await apiContext.post('https://api.qat.anddone.com/users/sessions', {
            data: {
                userName: username,
                password: password,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log('Response status:', response.status());
        console.log('Response headers:', response.headers());

        if (!response.ok()) {
            const responseText = await response.text();
            console.error('API Response:', responseText);
            throw new Error(`API login failed: ${response.status()} ${response.statusText()} - ${responseText}`);
        }

        const responseBody = await response.json();
        const cookies = await response.headersArray();
        const setCookieHeaders = cookies.filter(header => header.name.toLowerCase() === 'set-cookie');

        await apiContext.dispose();

        return {
            statusCode: response.status(),
            body: responseBody,
            cookies: setCookieHeaders,
            headers: response.headers(),
        };
    }

    /**
     * Extract token from response body
     * @param responseBody - API response body
     * @returns Token string
     */
    extractToken(responseBody: any): string {
        // Adjust this based on actual API response structure
        return responseBody.token || responseBody.accessToken || responseBody.data?.token || '';
    }

    /**
     * Extract session data from response
     * @param responseBody - API response body
     * @returns Session data object
     */
    extractSessionData(responseBody: any): any {
        return responseBody.data || responseBody;
    }
}
