using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClubsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClubsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/clubs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Club>>> GetClubs()
    {
        return await _context.Clubs
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    // GET: api/clubs/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Club>> GetClub(int id)
    {
        var club = await _context.Clubs.FindAsync(id);
        if (club == null) return NotFound();
        return club;
    }

    // POST: api/clubs
    [HttpPost]
    public async Task<ActionResult<Club>> CreateClub(Club newClub)
    {
        _context.Clubs.Add(newClub);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetClub), new { id = newClub.Id }, newClub);
    }

    // PUT: api/clubs/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateClub(int id, Club updatedClub)
    {
        if (id != updatedClub.Id) return BadRequest("Route id does not match club id.");

        var club = await _context.Clubs.FindAsync(id);
        if (club == null) return NotFound();

        club.Name = updatedClub.Name;
        club.Category = updatedClub.Category;
        club.Description = updatedClub.Description;
        club.PresidentName = updatedClub.PresidentName;
        club.ContactEmail = updatedClub.ContactEmail;
        club.IsActive = updatedClub.IsActive;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/clubs/5 (deactivates the club rather than deleting it outright)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeactivateClub(int id)
    {
        var club = await _context.Clubs.FindAsync(id);
        if (club == null) return NotFound();

        club.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
