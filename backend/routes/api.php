<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\Employer\OpportunityController as EmployerOpportunityController;
use App\Http\Controllers\Api\OpportunityController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\Employer\ApplicationController as EmployerApplicationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\RecommendationController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/opportunities', [OpportunityController::class, 'index']);
Route::get('/opportunities/{id}', [OpportunityController::class, 'show']);

// Logged in
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:applicant')->prefix('applicant')->group(function () {
        Route::get('/applications', [ApplicationController::class, 'index']);
        Route::post('/opportunities/{opportunity}/apply', [ApplicationController::class, 'store']);
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::get('/recommendations', [RecommendationController::class, 'index']);
    });

    Route::middleware('role:employer')->prefix('employer')->group(function () {
        Route::get('/opportunities/{opportunity}/applications', [EmployerApplicationController::class, 'index']);
        Route::patch('/applications/{application}/status', [EmployerApplicationController::class, 'updateStatus']);
        Route::get('/organization', [OrganizationController::class, 'show']);
        Route::put('/organization', [OrganizationController::class, 'update']);
        Route::apiResource('opportunities', EmployerOpportunityController::class);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
    
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/opportunities', [AdminController::class, 'opportunities']);
        Route::patch('/opportunities/{opportunity}/status', [AdminController::class, 'updateOpportunityStatus']);
        Route::delete('/opportunities/{opportunity}', [AdminController::class, 'deleteOpportunity']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{category}', [AdminController::class, 'deleteCategory']);
    });
});