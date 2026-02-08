<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('store_name')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('currency_symbol')->default('$');
            $table->decimal('tax_rate', 8, 2)->default(0);
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->decimal('min_order_value', 8, 2)->default(0);

            // The important time columns
            $table->string('open_at')->default('08:00');
            $table->string('close_at')->default('20:00');

            $table->boolean('email_notifications')->default(false);
            $table->boolean('sms_alerts')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
