using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnnouncementsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/announcements
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
    {
        return await _context.Announcements
            .OrderByDescending(a => a.PostDate)
            .ToListAsync();
    }

    // GET: api/announcements/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Announcement>> GetAnnouncement(int id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null) return NotFound();
        return announcement;
    }

    // POST: api/announcements
    [HttpPost]
    public async Task<ActionResult<Announcement>> CreateAnnouncement(Announcement newAnnouncement)
    {
        _context.Announcements.Add(newAnnouncement);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAnnouncement), new { id = newAnnouncement.Id }, newAnnouncement);
    }

    // PUT: api/announcements/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAnnouncement(int id, Announcement updatedAnnouncement)
    {
        if (id != updatedAnnouncement.Id) return BadRequest("Route id does not match announcement id.");

        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null) return NotFound();

        announcement.Title = updatedAnnouncement.Title;
        announcement.Content = updatedAnnouncement.Content;
        announcement.PriorityLevel = updatedAnnouncement.PriorityLevel;
        announcement.PostDate = updatedAnnouncement.PostDate;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/announcements/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAnnouncement(int id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null) return NotFound();

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
