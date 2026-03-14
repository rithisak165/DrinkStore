<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://drink-store-topaz.vercel.app',
        env('FRONTEND_URL', 'http://localhost:5173'),
    ],

    // Covers all Vercel preview deployments (drinkstore--preview-xxx.vercel.app)
    'allowed_origins_patterns' => [
        '#^https://.*\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,
];

