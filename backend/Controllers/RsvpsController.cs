using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RsvpsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RsvpsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/rsvps
    // GET: api/rsvps?eventId=5
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rsvp>>> GetRsvps([FromQuery] int? eventId)
    {
        var query = _context.Rsvps.AsQueryable();
        if (eventId.HasValue)
        {
            query = query.Where(r => r.EventId == eventId.Value);
        }

        return await query.OrderBy(r => r.Id).ToListAsync();
    }

    // GET: api/rsvps/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Rsvp>> GetRsvp(int id)
    {
        var rsvp = await _context.Rsvps.FindAsync(id);
        if (rsvp == null) return NotFound();
        return rsvp;
    }

    // POST: api/rsvps
    [HttpPost]
    public async Task<ActionResult<Rsvp>> CreateRsvp(Rsvp newRsvp)
    {
        _context.Rsvps.Add(newRsvp);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRsvp), new { id = newRsvp.Id }, newRsvp);
    }

    // PUT: api/rsvps/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRsvp(int id, Rsvp updatedRsvp)
    {
        if (id != updatedRsvp.Id) return BadRequest("Route id does not match RSVP id.");

        var rsvp = await _context.Rsvps.FindAsync(id);
        if (rsvp == null) return NotFound();

        rsvp.StudentName = updatedRsvp.StudentName;
        rsvp.StudentIdNumber = updatedRsvp.StudentIdNumber;
        rsvp.EventId = updatedRsvp.EventId;
        rsvp.DietaryNotes = updatedRsvp.DietaryNotes;
        rsvp.Status = updatedRsvp.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    public class UpdateStatusRequest
    {
        public RsvpStatus Status { get; set; }
    }

    // PATCH: api/rsvps/5/status
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateStatusRequest request)
    {
        var rsvp = await _context.Rsvps.FindAsync(id);
        if (rsvp == null) return NotFound();

        rsvp.Status = request.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/rsvps/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRsvp(int id)
    {
        var rsvp = await _context.Rsvps.FindAsync(id);
        if (rsvp == null) return NotFound();

        _context.Rsvps.Remove(rsvp);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
