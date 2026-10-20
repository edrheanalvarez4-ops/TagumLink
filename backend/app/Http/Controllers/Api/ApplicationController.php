<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // List the logged-in applicant's applications with their statuses
    public function index(Request $request): JsonResponse
    {
        $applications = $request->user()->applications()
            ->with(['opportunity:id,title,opportunity_type,location,organization_id',
                    'opportunity.organization:id,organization_name'])
            ->latest()
            ->get();

        return response()->json($applications);
    }

    public function store(Request $request, int $opportunityId): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'cover_letter' => ['nullable', 'string'],
        ]);

        // Only open, unexpired listings accept applications
        $opportunity = Opportunity::where('status', 'open')
            ->where(function ($q) {
                $q->whereNull('deadline')->orWhere('deadline', '>=', today());
            })
            ->findOrFail($opportunityId);

        // Friendly duplicate check (the database unique rule is the safety net)
        if (Application::where('opportunity_id', $opportunity->id)
            ->where('applicant_id', $user->id)->exists()) {
            return response()->json(
                ['message' => 'You have already applied to this listing.'], 409
            );
        }

        $application = Application::create([
            'opportunity_id' => $opportunity->id,
            'applicant_id' => $user->id,
            'cover_letter' => $data['cover_letter'] ?? null,
            'resume_path' => $user->profile?->resume_path,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        return response()->json($application, 201);
    }
}