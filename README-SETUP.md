## Backend Setup Required

1. In your Laravel backend's `config/app.php`, uncomment this line:
```php
App\Providers\BroadcastServiceProvider::class,
```

2. In your Laravel backend, run:
```bash
php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"
```

3. Make sure your Laravel backend's `.env` has these settings:
```
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=local
PUSHER_APP_KEY=local
PUSHER_APP_SECRET=local
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http
PUSHER_APP_CLUSTER=mt1
```

4. Start the WebSockets server:
```bash
php artisan websockets:serve
```