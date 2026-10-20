<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        return response()->json($profile);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone' => ['nullable', 'string', 'max:30'],
            'education_level' => ['nullable', 'string', 'max:100'],
            'academic_program' => ['nullable', 'string', 'max:150'],
            'school_name' => ['nullable', 'string', 'max:150'],
            'skills' => ['nullable', 'string'],
            'experience' => ['nullable', 'string'],
            'preferred_location' => ['nullable', 'string', 'max:150'],
        ]);

        $profile = $request->user()->profile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json($profile);
    }
}