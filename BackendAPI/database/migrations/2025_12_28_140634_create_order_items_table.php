<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();

            // SNAPSHOT DATA (Save history even if menu changes)
            $table->string('product_name');
            $table->string('size');          // "Medium"
            $table->decimal('price', 8, 2);  // 2.50
            $table->integer('quantity');
            $table->jsonb('options')->nullable(); // Sugar 50%, Less Ice

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
