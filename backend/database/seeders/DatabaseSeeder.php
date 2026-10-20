<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@tagumlink.test'],
            ['name' => 'System Admin', 'password' => 'admin12345', 'role' => 'admin', 'status' => 'active']
        );

        foreach (['Information Technology', 'Office Administration', 'Marketing',
                  'Education', 'Engineering', 'Accounting and Finance', 'Hospitality'] as $name) {
            Category::firstOrCreate(['name' => $name]);
        }
    }
}