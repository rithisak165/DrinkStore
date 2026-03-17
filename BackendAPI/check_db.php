<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

try {
    $connection = DB::getDefaultConnection();
    echo "Default Connection: " . $connection . PHP_EOL;
    echo "Database: " . DB::connection()->getDatabaseName() . PHP_EOL;
    echo "Driver: " . DB::connection()->getDriverName() . PHP_EOL;
    
    $users = User::all();
    echo "Users found: " . $users->count() . PHP_EOL;
    foreach ($users as $user) {
        echo "- {$user->name} ({$user->email}) [Role: {$user->role}]" . PHP_EOL;
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}
