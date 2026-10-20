<?php

namespace App\Http\Controllers\Api\Employer;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{
    private function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'opportunity_type' => ['required', 'in:job,internship'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'required_skills' => ['nullable', 'string'],
            'academic_program' => ['nullable', 'string', 'max:150'],
            'location' => ['required', 'string', 'max:255'],
            'slots' => ['required', 'integer', 'min:1'],
            'deadline' => ['nullable', 'date', 'after_or_equal:today'],
            'status' => ['required', 'in:open,closed,draft'],
        ];
    }

    // Employers only ever touch listings that belong to their own organization
    private function ownedOrFail(Request $request, Opportunity $opportunity): void
    {
        $organization = $request->user()->organization;

        abort_unless(
            $organization && $opportunity->organization_id === $organization->id,
            403,
            'You can only manage your own listings.'
        );
    }

    public function index(Request $request): JsonResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return response()->json([]);
        }

        return response()->json(
            $organization->opportunities()->with('category')->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $organization = $request->user()->organization;

        if (! $organization) {
            return response()->json(
                ['message' => 'Set up your organization details first.'], 422
            );
        }

        $opportunity = $organization->opportunities()->create(
            $request->validate($this->rules())
        );

        return response()->json($opportunity, 201);
    }

    public function show(Request $request, Opportunity $opportunity): JsonResponse
    {
        $this->ownedOrFail($request, $opportunity);

        return response()->json($opportunity->load('category'));
    }

    public function update(Request $request, Opportunity $opportunity): JsonResponse
    {
        $this->ownedOrFail($request, $opportunity);

        $opportunity->update($request->validate($this->rules()));

        return response()->json($opportunity);
    }

    public function destroy(Request $request, Opportunity $opportunity): JsonResponse
    {
        $this->ownedOrFail($request, $opportunity);

        $opportunity->delete();

        return response()->json(['message' => 'Listing deleted.']);
    }
}