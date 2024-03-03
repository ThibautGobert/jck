<?php

namespace App\Filament\Resources\ApostasyResource\Pages;

use App\Events\ApostasyCreatedEvent;
use App\Filament\Resources\ApostasyResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Event;

class EditApostasy extends EditRecord
{
    protected static string $resource = ApostasyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        Event::dispatch(new ApostasyCreatedEvent($this->record?->load('country')));
    }
}
