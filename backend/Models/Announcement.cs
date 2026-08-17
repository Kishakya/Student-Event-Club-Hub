using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public enum PriorityLevel
{
    Low,
    Normal,
    Urgent,
}

public class Announcement
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    public PriorityLevel PriorityLevel { get; set; } = PriorityLevel.Normal;

    // Stored without a timezone offset: posted in local campus time.
    [Column(TypeName = "timestamp without time zone")]
    public DateTime PostDate { get; set; } = DateTime.Now;
}
