using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
    {
        return await _context.Events
            .OrderBy(e => e.DateTime)
            .ToListAsync();
    }

    // GET: api/events/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Event>> GetEvent(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound();
        return ev;
    }

    // POST: api/events
    [HttpPost]
    public async Task<ActionResult<Event>> CreateEvent(Event newEvent)
    {
        _context.Events.Add(newEvent);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, newEvent);
    }

    // PUT: api/events/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateEvent(int id, Event updatedEvent)
    {
        if (id != updatedEvent.Id) return BadRequest("Route id does not match event id.");

        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound();

        ev.Title = updatedEvent.Title;
        ev.Description = updatedEvent.Description;
        ev.DateTime = updatedEvent.DateTime;
        ev.Location = updatedEvent.Location;
        ev.ClubId = updatedEvent.ClubId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/events/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound();

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
